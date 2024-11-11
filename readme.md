# Lehçe Kelime Uygulaması

Bu proje, Lehçe dili öğrenenler için tasarlanmış interaktif bir kelime öğrenme uygulamasıdır. Kullanıcılar kelimeleri kategorize edebilir, öğrenme durumlarını takip edebilir ve admin paneli aracılığıyla kelime listesini yönetebilirler.

## Özellikler

- Kullanıcı kaydı ve girişi
- Admin paneli
- Kelime listesi görüntüleme ve filtreleme
- Kelimeleri kategorilere ayırma (Öğrenilen, Zorlanılan, Tekrar Edilecek)
- Ses çalma özelliği (ElevenLabs API kullanarak)
- Kullanıcı profili ve ayarlar
- Dark mode / Light mode
- Responsive tasarım

## Teknolojiler

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- State Management: React Hooks
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React
- Routing: React Router DOM
- HTTP Requests: Axios

## Kurulum

### Gereksinimler

- Node.js (v14.0.0 veya üzeri)
- npm (v6.0.0 veya üzeri)
- MongoDB

### Adımlar

1. Repo'yu klonlayın:
   ```
   git clone https://github.com/kullaniciadi/lehce-kelime-uygulamasi.git
   cd lehce-kelime-uygulamasi
   ```

2. Backend için gerekli paketleri yükleyin:
   ```
   cd backend
   npm install
   ```

3. Frontend için gerekli paketleri yükleyin:
   ```
   cd ../frontend
   npm install
   ```

4. Backend klasöründe `.env` dosyası oluşturun ve gerekli ortam değişkenlerini ekleyin:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5001
   ```

5. Backend'i başlatın:
   ```
   cd ../backend
   npm start
   ```

6. Yeni bir terminal açın ve frontend'i başlatın:
   ```
   cd ../frontend
   npm start
   ```

7. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Kullanım

### Normal Kullanıcı Girişi

- Ana sayfada (`http://localhost:3000`) "Giriş Yap" veya "Kayıt Ol" seçeneğini kullanın.
- Giriş yaptıktan sonra kelime listesini görüntüleyebilir, kelimeleri kategorize edebilir ve profilinizi yönetebilirsiniz.

### Admin Girişi

- `http://localhost:3000/admingiris` adresine gidin.
- Admin hesabınızla giriş yapın (varsayılan: kullanıcı adı "hakan", e-posta "hakan@hakan.com", şifre "hakan").
- Admin panelinden kullanıcıları ve kelime listesini yönetebilirsiniz.

## API Endpoints

- `POST /api/register`: Yeni kullanıcı kaydı
- `POST /api/login`: Kullanıcı girişi
- `GET /api/user`: Kullanıcı bilgilerini getirme
- `PUT /api/user`: Kullanıcı bilgilerini güncelleme
- `POST /api/admin/register`: Admin kullanıcısı kaydı
- `POST /api/admin/login`: Admin girişi
- `GET /api/admin/users`: Tüm kullanıcıları listeleme (admin)
- `PUT /api/admin/users/:id`: Kullanıcı güncelleme (admin)
- `DELETE /api/admin/users/:id`: Kullanıcı silme (admin)

## Katkıda Bulunma

1. Bu repo'yu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## İletişim

Proje Sahibi: [Adınız](https://github.com/kullaniciadi)

Proje Linki: [https://github.com/kullaniciadi/lehce-kelime-uygulamasi](https://github.com/kullaniciadi/lehce-kelime-uygulamasi)