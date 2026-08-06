-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 04 Ağu 2026, 16:42:00
-- Sunucu sürümü: 10.4.28-MariaDB
-- PHP Sürümü: 8.0.28

--
-- Tablo döküm verisi `document_category_translations`
--

INSERT INTO `document_category_translations` (`id`, `document_category_id`, `language_id`, `name`) VALUES
(1, 1, 1, 'Teknoloji Geliştirme Bölgeleri Hakkında Mevzuat'),
(2, 2, 1, 'Ar-Ge Faaliyetleri Hakkında Mevzuat'),
(3, 3, 1, 'Diğer Belgeler');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `document_category_translations`
--
ALTER TABLE `document_category_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_doccat_lang` (`document_category_id`,`language_id`),
  ADD KEY `language_id` (`language_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `document_category_translations`
--
ALTER TABLE `document_category_translations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `document_category_translations`
--
ALTER TABLE `document_category_translations`
  ADD CONSTRAINT `document_category_translations_ibfk_1` FOREIGN KEY (`document_category_id`) REFERENCES `document_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `document_category_translations_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
