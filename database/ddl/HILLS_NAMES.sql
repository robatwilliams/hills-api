CREATE TABLE HILLS_NAMES (
  hillNumber SMALLINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  isPrimary boolean NOT NULL,
  PRIMARY KEY (hillNumber, name),
  FOREIGN KEY (hillNumber)
    REFERENCES HILLS(number)
)
