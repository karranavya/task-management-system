from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/task_manager"  # Change if using MongoDB Atlas
mongo = PyMongo(app)

@app.route('/')
def index():
    tasks = list(mongo.db.tasks.find())  # Fetch all tasks
    return render_template('index.html', tasks=tasks)

@app.route('/create-task', methods=['GET', 'POST'])
def create_task():
    if request.method == 'POST':
        task_data = {
            "projectName": request.form['projectName'],
            "taskName": request.form['taskName'],
            "taskInfo": request.form['taskInfo'],
            "deadline": request.form['deadline'],
            "createdAt": datetime.utcnow().isoformat(),
            "status": "todo"
        }
        mongo.db.tasks.insert_one(task_data)
        return redirect(url_for('index'))
    return render_template('create-task.html')

@app.route('/update-task/<task_id>', methods=['POST'])
def update_task(task_id):
    new_status = request.json.get('status')
    mongo.db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": {"status": new_status}})
    return jsonify({"message": "Task updated successfully"})

@app.route('/delete-task/<task_id>', methods=['POST'])
def delete_task(task_id):
    mongo.db.tasks.delete_one({"_id": ObjectId(task_id)})
    return jsonify({"message": "Task deleted successfully"})

@app.route('/update-task')
def update_task_page():
    return render_template('update-task.html')
if __name__ == '__main__':
    app.run(debug=True)
