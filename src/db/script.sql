-- DROP TABLE IF EXISTS monthly_income, income_sources;

-- Tabla principal: income_sources
CREATE TABLE income_sources (
    in_so_id INT AUTO_INCREMENT PRIMARY KEY,
    in_so_period INT NOT NULL,
    in_so_name VARCHAR(30) NOT NULL,
    in_so_total_sum INT NOT NULL DEFAULT 0
);

-- Tabla relacionada: monthly_income
CREATE TABLE monthly_income (
    mo_in_id INT AUTO_INCREMENT PRIMARY KEY,
    in_so_id INT NOT NULL,
    mo_in_month VARCHAR(30) NOT NULL,
    mo_in_amount INT NOT NULL DEFAULT 0,
    INDEX fk_income_sources_monthly_income_idx (in_so_id ASC),
    CONSTRAINT fk_income_sources_monthly_income1
    FOREIGN KEY (in_so_id) REFERENCES income_sources(in_so_id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Triggers para la actualización automática de la columna in_so_total_sum en la tabla income_sources
DELIMITER $$

CREATE TRIGGER tgr_monthly_income_insert
AFTER INSERT ON monthly_income
FOR EACH ROW
BEGIN
  UPDATE income_sources
  SET in_so_total_sum = in_so_total_sum + NEW.mo_in_amount
  WHERE in_so_id = NEW.in_so_id;
END $$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER tgr_monthly_income_update
AFTER UPDATE ON monthly_income
FOR EACH ROW
BEGIN
  UPDATE income_sources
  SET in_so_total_sum = in_so_total_sum - OLD.mo_in_amount + NEW.mo_in_amount
  WHERE in_so_id = NEW.in_so_id;
END $$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER tgr_monthly_income_delete
AFTER DELETE ON monthly_income
FOR EACH ROW
BEGIN
  UPDATE income_sources
  SET in_so_total_sum = in_so_total_sum - OLD.mo_in_amount
  WHERE in_so_id = OLD.in_so_id;
END $$

DELIMITER ;

-- Inserción de datos
INSERT INTO income_sources (in_so_period, in_so_name, in_so_total_sum)
VALUES
(2024, 'Ventas Online', 0),
(2023, 'Proyectos Freelance', 0);

INSERT INTO monthly_income (in_so_id, mo_in_month, mo_in_amount)
VALUES
(1, 'Enero', 150000), (1, 'Febrero', 200000), (1, 'Marzo', 180000),
(1, 'Abril', 175000), (1, 'Mayo', 210000), (1, 'Junio', 190000),
(1, 'Julio', 230000), (1, 'Agosto', 240000), (1, 'Septiembre', 225000),
(1, 'Octubre', 250000), (1, 'Noviembre', 245000), (1, 'Diciembre', 300000),
(2, 'Enero', 120000), (2, 'Febrero', 130000), (2, 'Marzo', 125000),
(2, 'Abril', 135000), (2, 'Mayo', 150000), (2, 'Junio', 140000),
(2, 'Julio', 155000), (2, 'Agosto', 160000), (2, 'Septiembre', 145000),
(2, 'Octubre', 170000), (2, 'Noviembre', 165000), (2, 'Diciembre', 180000);


-- Tabla principal: expense_sources
CREATE TABLE expense_sources (
    ex_so_id INT AUTO_INCREMENT PRIMARY KEY,
    ex_so_period INT NOT NULL,
    ex_so_name VARCHAR(255) NOT NULL,
    ex_so_essential BOOLEAN NOT NULL,
    ex_so_total_sum INT NOT NULL DEFAULT 0
);

-- Tabla relacionada: monthly_expense
CREATE TABLE monthly_expense (
    mo_ex_id INT AUTO_INCREMENT PRIMARY KEY,
    ex_so_id INT NOT NULL,
    mo_ex_month VARCHAR(255) NOT NULL,
    mo_ex_amount INT NOT NULL DEFAULT 0,
    INDEX fk_expense_sources_monthly_expense_idx (ex_so_id ASC),
    CONSTRAINT fk_expense_sources_monthly_expense
    FOREIGN KEY (ex_so_id) REFERENCES expense_sources (ex_so_id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Triggers para la actualización automática de la columna ex_so_total_sum en la tabla expense_sources
DELIMITER $$

CREATE TRIGGER tgr_monthly_expense_insert
AFTER INSERT ON monthly_expense
FOR EACH ROW
BEGIN
  UPDATE expense_sources
  SET ex_so_total_sum = ex_so_total_sum + NEW.mo_ex_amount
  WHERE ex_so_id = NEW.ex_so_id;
END $$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER tgr_monthly_expense_update
AFTER UPDATE ON monthly_expense
FOR EACH ROW
BEGIN
  UPDATE expense_sources
  SET ex_so_total_sum = ex_so_total_sum - OLD.mo_ex_amount + NEW.mo_ex_amount
  WHERE ex_so_id = NEW.ex_so_id;
END $$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER tgr_monthly_expense_delete
AFTER DELETE ON monthly_expense
FOR EACH ROW
BEGIN
  UPDATE expense_sources
  SET ex_so_total_sum = ex_so_total_sum - OLD.mo_ex_amount
  WHERE ex_so_id = OLD.ex_so_id;
END $$

DELIMITER ;

-- Inserción de datos
INSERT INTO expense_sources (ex_so_period, ex_so_name, ex_so_essential, ex_so_total_sum)
VALUES
(2024, 'Gastos de Marketing', TRUE, 0),
(2023, 'Suministros de Oficina', FALSE, 0),
(2024, 'Salarios', TRUE, 0),
(2023, 'Gastos Operativos', FALSE, 0);

INSERT INTO monthly_expense (ex_so_id, mo_ex_month, mo_ex_amount)
VALUES
(1, 'Enero', 50000), (1, 'Febrero', 60000), (1, 'Marzo', 55000),
(1, 'Abril', 52000), (1, 'Mayo', 61000), (1, 'Junio', 58000),
(1, 'Julio', 64000), (1, 'Agosto', 66000), (1, 'Septiembre', 62000),
(1, 'Octubre', 65000), (1, 'Noviembre', 63000), (1, 'Diciembre', 70000),
(2, 'Enero', 12000), (2, 'Febrero', 13000), (2, 'Marzo', 12500),
(2, 'Abril', 13500), (2, 'Mayo', 15000), (2, 'Junio', 14000),
(2, 'Julio', 15500), (2, 'Agosto', 16000), (2, 'Septiembre', 14500),
(2, 'Octubre', 17000), (2, 'Noviembre', 16500), (2, 'Diciembre', 18000),
(3, 'Enero', 150000), (3, 'Febrero', 160000), (3, 'Marzo', 155000),
(3, 'Abril', 170000), (3, 'Mayo', 165000), (3, 'Junio', 155000),
(3, 'Julio', 180000), (3, 'Agosto', 185000), (3, 'Septiembre', 170000),
(3, 'Octubre', 190000), (3, 'Noviembre', 175000), (3, 'Diciembre', 200000),
(4, 'Enero', 20000), (4, 'Febrero', 21000), (4, 'Marzo', 21500),
(4, 'Abril', 23000), (4, 'Mayo', 22000), (4, 'Junio', 21000),
(4, 'Julio', 24000), (4, 'Agosto', 25000), (4, 'Septiembre', 23500),
(4, 'Octubre', 25500), (4, 'Noviembre', 24500), (4, 'Diciembre', 26000);
