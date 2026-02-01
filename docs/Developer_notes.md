# DA SISTEMARE IMMEDIATAMENTE

- mettere il fatto che con un tasto puoi aggiungere l'app alla scheramta
- usare questo "C:\Users\Gabriele\AppData\Roaming\Python\Python314\Scripts\b2.exe" bucket update giornaledeilavori-bucket --cors-rules "[{\"corsRuleName\":\"allow-all\",\"allowedOrigins\":[\"https://localhost:5173\",\"http://localhost:5173\"],\"allowedOperations\":[\"b2_upload_file\",\"b2_upload_part\",\"b2_download_file_by_name\",\"b2_download_file_by_id\"],\"allowedHeaders\":[\"*\"],\"exposeHeaders\":[\"ETag\"],\"maxAgeSeconds\":3600}]"

# FUNZIONALITA' DA SISTEMARE
- sistemare elimina utente che non funziona
- alla registrazione → se esiste già uno user email uguale e user_types.name = 'ispettore di cantiere' → dire che la mail è già in uso
- aggiugere record necessari alla creazione del db con docker
- spiegare nella documentazione l'uso dei seguenti record nel db e crearli in automatico alla creazione del container:
    - record in user_type(id=1, name='admin') -> utilizzato/utilizzabile solo dal proprietario dell'app
        - insert into user_type(id, name) values (1, 'admin');
    - record in user_type(id=2, name='ispettore di cantiere') -> utilizzato dagli ispettori di cantiere (target principale di quest'app)
        - insert into user_type(id, name) values (2, 'ispettore di cantiere');
    - record in users(id=1, first_name='admin', last_name='admin', ecc..., owner_id=1) -> utilizzato/utilizzabile solo dal proprietario dell'app
        - insert into users(id, first_name, last_name, owner_id) values (1, 'admin', 'admin', 1);
- scrivere nella documentazione il fatto che ci possono essere piu mail uguali nella tabella users, ma non per users che si registrano come ispettori di cantiere

# FUNZIONALITA' DA AGGIUNGERE
- mettere un sistema di backup del database (ogni tanto un pg_dump)
- mettere in documentazione:
    - come avviare app
    - dove gira backend e dove websocket
- mettere gli id user_type 'admin', user_type 'ispettore di cantiere' e users 'admin' in un file .env e scrivere motivo in documentazione
    - modificare gli id in authRoutes.js register e login 
- mettere https in locale
- rimuovere google drive apis
- implementare foto, video e documenti per ogni singolo giorno:
    - per ogni singolo giorno
    - con cloud storage Backblaze B2
    - procedura
        - strutturare db in modo da avere per ogni giorno:
            - foto
            - video
            - documenti
- accesso con google
- per ogni persona registrata aggiungere:
    - cantiere di esempio
    - video tutorial
        - appare alla registrazione dell'utente un popup con:
            - video tutorial (non youtube pk poi appaiono pubblicità)
            - scritta con: come vedere tutorial in seguito
            - tasto per contattare un consulente che spiega telefonicamente come usare l'app (con logo whatsapp sul stasto e messagio predefinito)
- fare una pwa
- accesso per i lavoratori/operai(possono avere una chat con l'ispettore di cantiere per scrivere se sono malati, inviare certificati, documenti, eccetera...)