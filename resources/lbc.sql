--
-- File generated with SQLiteStudio v3.1.1 on Sat Nov 26 13:18:47 2016
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: agl
CREATE TABLE agl (datum_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER REFERENCES data_events (event_id), file TEXT, choice INTEGER);

-- Table: data_events
CREATE TABLE data_events (event_id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id TEXT REFERENCES subjects (subject_id), "table" TEXT, write_time INTEGER);

-- Table: metadata
CREATE TABLE metadata (task TEXT, variable TEXT, value TEXT, PRIMARY KEY (task, variable));

-- Table: spr_frank
CREATE TABLE spr_frank (datum_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER REFERENCES data_events (event_id), train INTEGER, sent_num INTEGER, word_num INTEGER, word TEXT, rt DOUBLE, sentence TEXT, corr INTEGER);

-- Table: spr_newport
CREATE TABLE spr_newport (datum_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER REFERENCES data_events (event_id), train INTEGER, sent_num INTEGER, word_num INTEGER, word TEXT, rt DOUBLE, sentence TEXT, corr INTEGER, gram TEXT, "group" TEXT);

-- Table: spr_short
CREATE TABLE spr_short (datum_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER REFERENCES data_events (event_id), train INTEGER, sent_num INTEGER, word_num INTEGER, word TEXT, rt DOUBLE, sentence TEXT, corr INTEGER);

-- Table: subjects
CREATE TABLE subjects (subject_id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;