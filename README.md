# Qwilr_stock
Prerequisite:
- NodeJS
- Python 3
- pip

update npm
```sh
$ npm install npm@latest -g
```
Install virtual env && Activate environment
```sh
$ sudo pip install virtualenv
$ virtualenv env
$ source env/bin/activate
```

install python package
```sh
$ pip install -r requirements.txt
```

install dependencies for react
```sh
$ npm i
```

migrate
```sh
$ cd stock
$ python manage.py makemigration
$ python manage.py migrate
```

setup frond end

```sh
$ cd frontend
$ webpack
```

run the program
```sh
$ python manage.py runserver
```