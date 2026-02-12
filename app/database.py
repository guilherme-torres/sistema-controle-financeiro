from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase


engine = create_engine("sqlite:///finance.db")

LocalSession = sessionmaker(bind=engine, autocommit=False, autoflush=False,)

class Base(DeclarativeBase):
    pass

def get_db():
    db = LocalSession()
    try:
        yield db
    except:
        db.rollback()
        raise
    finally:
        db.close()

@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    ac = dbapi_connection.autocommit
    dbapi_connection.autocommit = True
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.execute("PRAGMA journal_mode = WAL")
    cursor.execute("PRAGMA synchronous = NORMAL")
    cursor.close()
    dbapi_connection.autocommit = ac