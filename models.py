from flask_pymongo import PyMongo

class Task:
    def __init__(self, title, description, status="To Do"):
        self.title = title
        self.description = description
        self.status = status

    def to_dict(self):
        return {"title": self.title, "description": self.description, "status": self.status}
