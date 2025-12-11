FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    libzip-dev

# Enable GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Enable pdo_mysql & zip
RUN docker-php-ext-install pdo_mysql zip

# -------------------------------------------------
# Install Composer
# -------------------------------------------------
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Copy application
COPY . /app
WORKDIR /app

# Composer install (production optimized)
RUN composer install --no-dev --optimize-autoloader

# -------------------------------------------------
# Start Laravel server (for Railway)
# -------------------------------------------------
CMD php artisan serve --host 0.0.0.0 --port $PORT
