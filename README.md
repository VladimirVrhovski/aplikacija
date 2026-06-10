# Student Grade Tracker

Jednostavna, samostalna Node.js web aplikacija dizajnirana da demonstrira Docker
kontejnerizaciju i CI/CD automatizaciju korišćenjem GitHub Actions.

Aplikacija pruža dashboard za praćenje ocena položenih predmeta gde ulogovani
studenti mogu da upisuju ocene položenih ispita, računaju prosek i prate ukupne ostvarene ESPB kredite.

---

## Tehnički Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Templating**: EJS (Server-Side Rendered HTML)
- **Authentication**: Session-based auth (`express-session` + `bcryptjs` password hashing)
- **Database**: MySQL (potpuno parametrizovani async/await upiti putem `mysql2`)
- **Testing**: Jest unit testovi + Supertest integracioni testovi
- **Styling**: Minimalistički, responsivan plain CSS

---

## Početak rada

### 1. Preduslovi
- Node.js (v18+)
- npm (v9+)
- Pokrenuta MySQL instanca (za ručno pokretanje)

### 2. Lokalna instalacija
Klonirajte ovaj repozitorijum na vaš računar, zatim pokrenite:
```bash
npm install
```

### 3. Podešavanje MySQL Database šeme
Da biste lokalno inicijalizovali MySQL database šemu, pokrenite `schema.sql` skriptu
nad vašom database instancom:
```bash
mysql -u root -p gradetracker < schema.sql
```

### 4. Lokalno pokretanje
Za pokretanje Express servera:
```bash
npm start
```
Aplikacija će se pokrenuti na portu `3000` (ili na portu definisanom u `PORT`).
Otvorite web pretraživač i navigirajte na `http://localhost:3000`.

### 5. Pokretanje testova
Za pokretanje kompletnog Jest test suite-a koji pokriva unit kalkulacije i health
endpoint integracije:
```bash
npm test
```

---

## Docker kontejnerizacija i Compose

Aplikacija uključuje lagan, optimizovan Node.js Docker image i kompletnu Docker Compose
konfiguraciju za nesmetano lokalno testiranje.

### Lokalni razvoj korišćenjem Docker Compose
Najlakši način za pokretanje aplikacije sa potpuno integrisanim MySQL kontejnerom
je kroz Docker Compose:
```bash
docker compose up --build
```
Ova komanda build-uje aplikaciju, pokreće MySQL service kontejner, automatski importuje
database šemu iz `schema.sql` i izlaže pokrenutu aplikaciju na portu `3000`.

---

## Potrebne environment varijable

Za konfigurisanje kredencijala konekcije ili session podešavanja, definišite sledeće
varijable:
* **`PORT`**: Port servera (podrazumevano `3000`).
* **`SESSION_SECRET`**: Secret koji koristi `express-session` za potpisivanje session
  identifier cookie-ja.
* **`DB_HOST`**: Host adresa database servera (podrazumevano `db`).
* **`DB_PORT`**: Port database servera (podrazumevano `3306`).
* **`DB_USER`**: Database korisničko ime (podrazumevano `root`).
* **`DB_PASSWORD`**: Database lozinka (podrazumevano prazno `""`).
* **`DB_NAME`**: Naziv database-a (podrazumevano `gradetracker`).

---

## CI/CD Pipeline i GitHub Secrets

Automatizovani GitHub Actions workflow je definisan u `.github/workflows/ci.yml`. On:
1. Priprema privremene MySQL service kontejnere, primenjuje schema definicije i
   automatski pokreće testove na svim pull request-ovima i direktnim push-ovima na `main`.
2. Automatski build-uje i push-uje tagovan Docker image na Docker Hub svaki put kada
   se izmene merguju u `main`.

Za konekciju sa bazom u CI nisu potrebni novi GitHub secrets (koriste se samo
hardcoded test kredencijali).

### Potrebni Docker Hub GitHub Secrets (nepromenjeni)
Da biste koristili build-and-push job, konfigurišite sledeće secrets unutar vašeg
GitHub repozitorijuma pod **Settings > Secrets and variables > Actions**:

1. **`DOCKER_USERNAME`**: Vaše Docker Hub korisničko ime.
2. **`DOCKER_TOKEN`**: Vaš Docker Hub Access Token (generišite ga na Docker Hub-u
   pod Account Settings > Security).
