# Laravel PHP-FPM Dockerfile
# Template markers: {{PHP_VERSION}}, {{EXTENSIONS}}

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
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        xml \
        opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure opcache for development
RUN echo 'opcache.enable=1' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.memory_consumption=256' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.interned_strings_buffer=16' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.max_accelerated_files=10000' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.validate_timestamps=1' >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo 'opcache.revalidate_freq=0' >> /usr/local/etc/php/conf.d/opcache.ini

# Configure PHP for development
RUN echo 'memory_limit=512M' >> /usr/local/etc/php/conf.d/docker.ini \
    && echo 'upload_max_filesize=100M' >> /usr/local/etc/php/conf.d/docker.ini \
    && echo 'post_max_size=100M' >> /usr/local/etc/php/conf.d/docker.ini \
    && echo 'max_execution_time=60' >> /usr/local/etc/php/conf.d/docker.ini

# Set working directory
WORKDIR /var/www

# Set proper permissions
RUN chown -R www-data:www-data /var/www

# Switch to non-root user
USER www-data

# Expose PHP-FPM port
EXPOSE 9000

CMD ["php-fpm"]
