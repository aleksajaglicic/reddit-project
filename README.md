# reddit-project

Reddit Clone projekat - web aplikacija za upravljanje temama i komentarima nalik Reddit-u. Aplikacija koristi Flask (backend), React sa TypeScript-om (frontend) i PostgreSQL (baza podataka). 

## Funkcionalnosti

1. **Korisnički interfejs (UI)** je razvijen kao React aplikacija, koja omogućava korisnicima da:
   - Registruju nove naloge
   - Loguju se sa postojećim nalogom
   - Izmene svoj korisnički profil
   - Kreiraju nove teme i postavljaju komentare
   - Upvote/Downvote komentare
   - Pretplate se na teme i primaju obaveštenja o novim komentarima
   - Brišu sopstvene teme
   - Pretražuju i sortiraju teme prema broju komentara, upvote-ova i downvote-ova
   - Zatvore ili otvore teme za komentarisanje

2. **Backend (Engine)** je implementiran kao Flask API aplikacija. Komunicira sa frontend-om i bazom podataka putem REST API-ja. 
   - Backend sadrži sve logike vezane za obradu podataka, uključujući registraciju, prijavu, upravljanje temama i komentarima, upvote/downvote funkcionalnosti, slanje obaveštenja korisnicima putem mejlova i više.
   - **Flask Mail** se koristi za slanje mejlova korisnicima prilikom novih komentara na teme na koje su pretplaćeni.

3. **Baza podataka (DB)** je PostgreSQL baza koja skladišti sve bitne podatke aplikacije, kao što su korisnici, teme, komentari, upvote/downvote-ovi i obaveštenja. 
   - Baza je dizajnirana tako da omogućava efikasno skladištenje i pretragu podataka.

4. **Dockerizacija**: Aplikacija, uključujući UI, backend i bazu podataka, je dockerizovana pomoću **Docker Compose** kako bi omogućila lakše postavljanje i skaliranje sistema.

## Akcije koje su podržane u aplikaciji:
- **Registracija novog korisnika** sa informacijama kao što su ime, prezime, adresa, telefon, email, lozinka.
- **Logovanje postojećeg korisnika** putem emaila i lozinke.
- **Izmena korisničkog profila**.
- **Kreiranje teme** na koju se drugi korisnici mogu pretplatiti i ostaviti komentare.
- **Postavljanje komentara** uz mogućnost upvote/downvote.
- **Pretplata na teme** i slanje mejlova svim pretplaćenim korisnicima prilikom novih komentara.
- **Upvote i downvote komentara** uz mogućnost da se to uradi direktno iz mejla.
- **Brisanje teme** od strane vlasnika.
- **Pretraga i sortiranje tema** prema broju komentara, upvote-ova i downvote-ova.
- **Zatvaranje i otvaranje tema za komentarisanje** od strane vlasnika teme.

## Tehnologije
- **Frontend**: React + TypeScript
- **Backend**: Flask
- **Baza podataka**: PostgreSQL
- **Slanje mejlova**: Flask Mail
- **Docker**: Docker Compose za postavljanje aplikacije i baze podataka.

## Pokretanje aplikacije

Da biste pokrenuli aplikaciju na svom računaru, pratite sledeće korake:

### 1. Klonirajte repozitorijum

Klonirajte repo sa GitHub-a:

```bash
git clone https://github.com/aleksajaglicic/reddit-project.git
cd reddit-project
```
2. Pokrenite aplikaciju koristeći Docker Compose
```bash
docker-compose up --build
```
3. Okruženje za razvoj

Ako želite da radite u razvojnom okruženju, možete koristiti sledeće komande da pokrenete aplikaciju bez Docker-a:
Pokrenite backend (Flask)
```bash
cd backend
pip install -r requirements.txt
flask run
```
Pokrenite frontend (React + TypeScript)
```bash
cd frontend
npm install
npm start
docker-compose up --build
```
