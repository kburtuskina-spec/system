-- sample objects
INSERT INTO objects (name, description) VALUES
('Главный склад','Основное хранение'),
('Лаборатория','Оборудование для исследований');

-- sample materials
INSERT INTO materials (name, unit) VALUES
('Картридж HP','шт'),
('Микроскоп','шт'),
('Ацетон','л');

-- sample users
INSERT INTO users (full_name, role, login, password) VALUES
('Иванов И. Иванович','мастер','master','pass'),
('Петров П. Петрович','ОПП','opp','pass'),
('Сидоров С. Сидорович','снабжение','supply','pass'),
('Админ А.','администратор','admin','pass');

-- sample requests
INSERT INTO requests (requester, department, object_id, item, quantity, deadline, status, description, created_by)
VALUES
('Иванов И.И.','Отдел закупок',1,'Картридж HP',2,'2026-07-01','создана','Нужны два картриджа для принтера',1),
('Петрова А.А.','Лаборатория',2,'Микроскоп',1,'2026-06-30','в обработке','Техническое обслуживание',2);

-- attach materials to requests
INSERT INTO request_materials (request_id, material_id, quantity, note) VALUES
(1,1,2,'Совместимые картриджи'),
(2,2,1,'Сервисный микроскоп');
