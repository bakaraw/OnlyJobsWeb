#!/bin/bash

# Fix permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Wait for MySQL to be ready
echo "Waiting for database..."
while ! nc -z db 3306; do
    sleep 2
    echo "Still waiting for database..."
done
echo "Database is ready!"

# Generate app key if not set
php artisan key:generate --force

# Discover packages
php artisan package:discover

# Run migrations
php artisan migrate --force

php artisan db:seed --force

# Start PHP-FPM
exec php-fpm
