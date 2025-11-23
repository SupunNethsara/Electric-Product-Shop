FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git

RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-png

RUN docker-php-ext-install gd pdo pdo_mysql zip

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate

CMD php artisan serve --host=0.0.0.0 --port=8080
