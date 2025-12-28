# Drupal PHP-FPM Dockerfile
# Includes Drush

FROM php:{{PHP_VERSION}}-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libicu-dev \
    libxml2-dev \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        gd \
        zip \
        intl \
        xml \
        opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Drush launcher
RUN curl -OL https://github.com/drush-ops/drush-launcher/releases/latest/download/drush.phar \
    && chmod +x drush.phar \
    && mv drush.phar /usr/local/bin/drush

# Configure opcache for development
RUN echo 'opcache.enable=1' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.memory_consumption=256' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.interned_strings_buffer=16' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.max_accelerated_files=10000' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.validate_timestamps=1' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.revalidate_freq=0' >> /usr/local/etc/php/conf.d/opcache.ini

# Configure PHP
RUN echo 'memory_limit=512M' >> /usr/local/etc/php/conf.d/docker.ini \
    && echo 'upload_max_filesize=100M' >> /usr/local/etc/php/conf.d/docker.ini \
    && echo 'post_max_size=100M' >> /usr/local/etc/php/conf.d/docker.ini \
    && echo 'max_execution_time=300' >> /usr/local/etc/php/conf.d/docker.ini

# Set working directory
WORKDIR /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
