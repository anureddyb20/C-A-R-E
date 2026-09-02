import tkinter as tk
from tkinter import ttk
import serial
import json
import threading
import time
import math
from collections import deque
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Configuration - User can adjust these based on their system
SERIAL_PORT = 'COM3' 
BAUD_RATE = 115200

class CareMonitorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("C.A.R.E. Desktop Monitor")
        self.root.geometry("800x600")
        self.root.configure(bg="#0F766E") # Medical Teal

        self.is_running = True
        self.after_id = None

        # Data buffers
        self.ecg_data = deque(maxlen=200)
        self.time_data = deque(maxlen=200)
        self.start_time = time.time()
        
        self.setup_ui()
        
        # Window close handler
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)

        # Start Serial reading thread
        self.serial_thread = threading.Thread(target=self.read_serial_data, daemon=True)
        self.serial_thread.start()

        self.update_plot()

    def on_closing(self):
        self.is_running = False
        if self.after_id:
            try:
                self.root.after_cancel(self.after_id)
            except Exception:
                pass
        plt.close('all')
        self.root.destroy()

    def setup_ui(self):
        # Header
        header = tk.Frame(self.root, bg="#0F766E", pady=10)
        header.pack(fill=tk.X)
        tk.Label(header, text="C.A.R.E. Gateway Monitor", font=("Arial", 24, "bold"), bg="#0F766E", fg="white").pack()

        # Stats Frame
        stats_frame = tk.Frame(self.root, bg="#0F766E")
        stats_frame.pack(fill=tk.X, pady=10)
        
        self.hr_label = tk.Label(stats_frame, text="HR: -- BPM", font=("Arial", 20, "bold"), bg="#0F766E", fg="#F8FAFC")
        self.hr_label.pack(side=tk.LEFT, padx=50)

        self.stress_label = tk.Label(stats_frame, text="Stress Index: --", font=("Arial", 20, "bold"), bg="#0F766E", fg="#F8FAFC")
        self.stress_label.pack(side=tk.RIGHT, padx=50)

        self.panic_label = tk.Label(self.root, text="", font=("Arial", 24, "bold"), bg="#0F766E", fg="#E11D48")
        self.panic_label.pack(pady=5)

        # Matplotlib Plot Frame
        plot_frame = tk.Frame(self.root, bg="white", bd=2, relief=tk.GROOVE)
        plot_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        self.fig, self.ax = plt.subplots(figsize=(8, 4), dpi=100)
        self.line, = self.ax.plot([], [], color="#0F766E", lw=2)
        self.ax.set_ylim(0, 4095)
        self.ax.set_xlim(0, 10)
        self.ax.set_title("Live ECG Waveform", color="#334155", fontweight="bold")
        self.ax.grid(True, linestyle="--", alpha=0.5)
        
        # Style adjustments
        self.ax.spines['top'].set_visible(False)
        self.ax.spines['right'].set_visible(False)
        self.fig.tight_layout()

        self.canvas = FigureCanvasTkAgg(self.fig, master=plot_frame)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def generate_mock_data(self):
        current_time = time.time() - self.start_time
        ecg_value = 2048 + int(1000 * math.sin(current_time * 5) + 200 * math.sin(current_time * 20))
        panic = 1 if int(current_time) % 20 == 0 and current_time > 5 else 0
        return {
            "ecg": ecg_value,
            "hr": 72 + int(5 * math.sin(current_time * 0.5)),
            "gsr": 500 + int(20 * math.sin(current_time * 0.1)),
            "panic": panic
        }

    def process_data_point(self, data):
        current_time = time.time() - self.start_time
        self.time_data.append(current_time)
        self.ecg_data.append(data.get("ecg", 2048))
        
        hr = data.get("hr", 0)
        stress = data.get("gsr", 0)
        panic = data.get("panic", 0)

        if self.is_running:
            self.root.after(0, self.update_labels, hr, stress, panic)

    def read_serial_data(self):
        try:
            ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
            while self.is_running:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    try:
                        data = json.loads(line)
                        self.process_data_point(data)
                    except json.JSONDecodeError:
                        pass
        except (serial.SerialException, Exception):
            if self.is_running:
                self.root.after(0, self.update_status, f"Simulating (No device on {SERIAL_PORT})")
            
            # Fallback to simulated data generator
            while self.is_running:
                data = self.generate_mock_data()
                self.process_data_point(data)
                time.sleep(0.05)

    def update_labels(self, hr, stress, panic):
        if not self.is_running:
            return
        try:
            self.hr_label.config(text=f"HR: {hr} BPM")
            self.stress_label.config(text=f"Stress Index: {stress}")
            if panic == 1:
                self.panic_label.config(text="EMERGENCY: PANIC BUTTON PRESSED!", fg="#E11D48")
                self.root.configure(bg="#E11D48")
                self.hr_label.config(bg="#E11D48")
                self.stress_label.config(bg="#E11D48")
            else:
                self.panic_label.config(text="")
                self.root.configure(bg="#0F766E")
                self.hr_label.config(bg="#0F766E")
                self.stress_label.config(bg="#0F766E")
        except Exception:
            pass

    def update_status(self, msg):
        if not self.is_running:
            return
        try:
            self.root.title(f"C.A.R.E. Desktop Monitor - [{msg}]")
        except Exception:
            pass

    def update_plot(self):
        if not self.is_running:
            return
        try:
            if len(self.time_data) > 0:
                self.line.set_xdata(self.time_data)
                self.line.set_ydata(self.ecg_data)
                
                # Auto scroll x-axis for continuous wave
                current_time = self.time_data[-1]
                if current_time > 10:
                    self.ax.set_xlim(current_time - 10, current_time)
                
                self.canvas.draw_idle()
            
            # Schedule next update (20 FPS)
            self.after_id = self.root.after(50, self.update_plot)
        except Exception:
            pass

if __name__ == "__main__":
    root = tk.Tk()
    app = CareMonitorApp(root)
    root.mainloop()
