FROM wordpress:php8.1-apache

ARG XDEBUG_PORT=9003

RUN pecl install xdebug
RUN docker-php-ext-enable xdebug
RUN printf "%s\n" \
    "zend_extension=xdebug" \
    "xdebug.mode=debug" \
    "xdebug.start_with_request=yes" \
    "xdebug.client_host=host.docker.internal" \
    "xdebug.client_port=${XDEBUG_PORT}" \
    > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini