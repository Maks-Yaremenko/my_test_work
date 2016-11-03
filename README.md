Для запуска выполните в консоли следующие команды:

1. npm i -g gulp sequelize-cli
2. git clone https://github.com/Maks-Yaremenko/my_test_work.git
3. cd my_test_work
4. npm i

Подготовка БД (MySQL), файл конфигурации лежит в server/config/config.json
mysql> CREATE DATABASE `test_cleveroad` CHARACTER SET utf8 COLLATE utf8_general_ci;

5. cd server
6. sequelize db:migrate
7. создайте папку server/public/images

Запуск:
8. gulp (сервер работает по адресу localhost:8080)
