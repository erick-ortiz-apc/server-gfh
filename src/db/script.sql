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