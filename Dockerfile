FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip

# Enable GD extension
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Install other PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Copy project files
COPY . /var/www/html

WORKDIR /var/www/html

# Composer install
RUN composer install --no-dev --optimize-autoloader
