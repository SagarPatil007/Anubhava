FROM postgres:18

RUN if [ ! -e /usr/share/zoneinfo/Asia/Calcutta ]; then \
        ln -s Kolkata /usr/share/zoneinfo/Asia/Calcutta; \
    fi
