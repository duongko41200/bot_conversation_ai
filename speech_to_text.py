import speech_recognition as sr
import pyttsx3

def recognize_speech():
    recognizer = sr.Recognizer()
    engine = pyttsx3.init()

    # Lấy danh sách giọng nói
    voices = engine.getProperty('voices')
    print('Test voices:', voices)

    # Chọn giọng nữ (hoặc giọng bạn muốn)
    engine.setProperty('voice', voices[1].id)  # voices[1] thường là giọng nữ

    while True:
        # Sử dụng microphone làm nguồn âm thanh
        with sr.Microphone(device_index=17) as source:
            print("Xin mời nói...")
            # recognizer.adjust_for_ambient_noise(source)  # Điều chỉnh cho tiếng ồn xung quanh

            try:
                # Lắng nghe âm thanh từ micro
                audio = recognizer.listen(source, timeout=3, phrase_time_limit=5) 
                print("Đang nhận dạng...")

                # Nhận dạng giọng nói sử dụng Google Web Speech API
                text = recognizer.recognize_google(audio)

                # Sử dụng pyttsx3 để phát âm lại văn bản
                engine.say(text)
                engine.runAndWait()
                print(f"Bạn đã nói: {text}")

            except sr.WaitTimeoutError:
                # Không có âm thanh trong thời gian chờ, không báo lỗi, tiếp tục chương trình
                print("Không có âm thanh trong 3 giây, nhưng chương trình vẫn tiếp tục.")
            except sr.UnknownValueError:
                print("Không thể nhận dạng giọng nói.")
                engine.say("I can't understand what you said")
                engine.runAndWait()
            except sr.RequestError as e:
                print(f"Lỗi kết nối đến dịch vụ nhận dạng: {e}")
                engine.say("Error with the recognition service.")
                engine.runAndWait()
            except Exception as e:
                print(f"Đã xảy ra lỗi: {e}")
                engine.say("An unexpected error occurred.")
                engine.runAndWait()

if __name__ == "__main__":
    recognize_speech()
