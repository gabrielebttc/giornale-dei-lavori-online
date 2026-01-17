# FUNZIONALITA' DA SISTEMARE
- alla registrazione → se esiste già uno user con stessa email e allo stesso tempo user tipo admin(o quello usato per quelli che usano l'app) dire che la mail è già in uso
- spiegare nella documentazione l'uso dei seguenti record nel db e crearli in automatico alla creazione del container:
    - record in user_types(id=1, name="admin", owner_id=1) -> utilizzato/utilizzabile solo dal proprietario dell'app
    - record in user_types(id=2, name="ispettore di cantiere", owner_id=1) -> utilizzato dagli ispettori di cantiere (target principale di quest'app)
    - record in users(id=1, first_name="admin", last_name="admin", ecc..., owner_id=1) -> utilizzato/utilizzabile solo dal proprietario dell'app
- scrivere nella documentazione il fatto che ci possono essere piu mail uguali nella tabella users, ma non per users che si registrano come ispettori di cantiere

# FUNZIONALITA' DA AGGIUNGERE
- concludere google drive apis
- fare una pwa
- accesso con google
- accesso per i lavoratori/operai(possono avere una chat con l'ispettore di cantiere per scrivere se sono malati, inviare certificati, documenti, eccetera...)