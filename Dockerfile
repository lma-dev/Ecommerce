# syntax=docker/dockerfile:1.6

FROM composer:2.7 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-autoloader \
    --no-scripts
COPY . .
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist

FROM php:8.2-fpm-alpine AS base

# Install runtime dependencies
RUN apk add --no-cache \
        bash \
        curl \
        git \
        icu-data-full \
        icu-libs \
        libzip \
        nodejs \
        npm \
        oniguruma \
        openssl \
        mysql-client \
        supervisor \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libwebp-dev \
        libzip-dev \
        oniguruma-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install \
        bcmath \
        intl \
        mbstring \
        pcntl \
        pdo_mysql \
        zip \
        exif \
        gd \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

WORKDIR /var/www/html

COPY --from=vendor /app /var/www/html

COPY docker/php/conf.d/app.ini /usr/local/etc/php/conf.d/app.ini

COPY --from=vendor /usr/bin/composer /usr/bin/composer

RUN mkdir -p storage \
    && mkdir -p bootstrap/cache \
    && mkdir -p node_modules \
    && mkdir -p public/storage \
    && chown -R www-data:www-data storage bootstrap/cache vendor node_modules public/storage

USER www-data

CMD ["php-fpm"]
