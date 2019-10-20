CREATE TABLE HILLS (
  countries SET('GB-ENG', 'GB-SCT', 'GB-WAL', 'IE', 'IM') NOT NULL,
  heightFeet DECIMAL(6, 2) UNSIGNED NOT NULL, -- 9999.99
  heightMetres DECIMAL(6, 2) UNSIGNED NOT NULL, -- 9999.99
  lists SET('BIRKETT', 'CORBETT', 'DONALD', 'GRAHAM', 'HEWITT', 'MARILYN', 'MUNRO', 'NUTTALL', 'WAINWRIGHT') NOT NULL,
  name VARCHAR(100) NOT NULL,
  number SMALLINT UNSIGNED NOT NULL,
  parentMarilynNumber SMALLINT UNSIGNED NULL,
  PRIMARY KEY (number)
)
