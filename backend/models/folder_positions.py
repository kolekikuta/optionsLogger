from database import db


class FolderPositions(db.Model):
    __tablename__ = "folder_positions"

    folder_id = db.Column(db.String(36), db.ForeignKey("folders.id"), primary_key=True)
    position_id = db.Column(db.String(36), db.ForeignKey("positions.id"), primary_key=True)