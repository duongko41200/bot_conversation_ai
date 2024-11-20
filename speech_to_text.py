import speech_recognition as sr

def recognize_speech():
    recognizer = sr.Recognizer()
    
    # Sử dụng microphone làm nguồn âm thanh
    with sr.Microphone() as source:
        print("Xin mời nói...")
        recognizer.adjust_for_ambient_noise(source)  # Điều chỉnh cho tiếng ồn xung quanh
        audio = recognizer.listen(source)  # Lắng nghe âm thanh
        
    try:
        # Nhận dạng giọng nói sử dụng Google Web Speech API
        print("Đang nhận dạng...")
        text = recognizer.recognize_google(audio, language="vi-VN")
        print(f"Bạn đã nói: {text}")
        return {"text": text}
    except sr.UnknownValueError:
        print("Không thể nhận dạng giọng nói")
        return {"text": "Không thể nhận dạng giọng nói"}
    except sr.RequestError as e:
        print(f"Lỗi kết nối đến dịch vụ nhận dạng: {e}")
        return {"text": "Lỗi kết nối đến dịch vụ nhận dạng"}

if __name__ == "__main__":
    result = recognize_speech()
    print(result)
