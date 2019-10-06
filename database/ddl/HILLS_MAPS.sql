CREATE TABLE HILLS_MAPS (
  hillNumber SMALLINT UNSIGNED NOT NULL,
  scale TINYINT UNSIGNED NOT NULL,
  sheet CHAR(4) NOT NULL, -- fit "OL11"
  PRIMARY KEY (hillNumber, scale, sheet),
  FOREIGN KEY (hillNumber)
    REFERENCES HILLS(number)
)
