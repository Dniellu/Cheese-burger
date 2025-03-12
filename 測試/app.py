from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def home():
    return "智慧路牌系統已啟動！"

@app.route('/set_direction', methods=['GET'])
def set_direction():
    destination = request.args.get('destination')
    return f"設定方向為：{destination}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
