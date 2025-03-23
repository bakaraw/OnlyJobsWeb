# Only jobs wow

- Job listing platform

## Tech Stack and Version

- **Laravel 11.x**

- **PHP 8.2**

- **mysql 8.0.41**

## Setting up

- install `Composer`,`xampp`, and`PHP 8.2 or higher`

- clone repo

- install nodejs and npm package manager

- turn on `mysql` and `apache` in your `xampp` control panel

- create a file named `.env` in the projects folder and copy the contents of `.env.example` to the `.env`

- in the projects folder, open powershell or cmd and run the following: 

```sh
composer install
npm install
php artisan migrate
npm run dev
```

- open another instance of terminal, then run

```sh
php artisan serve
```

- go to this page http://127.0.0.1:8000

done



