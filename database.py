def add_task(title, description):
    task = Task(title, description).to_dict()
    mongo.db.tasks.insert_one(task)

def get_tasks():
    return list(mongo.db.tasks.find())
