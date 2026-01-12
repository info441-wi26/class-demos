--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) UNSIGNED NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `author` varchar(200) DEFAULT 'Fitz',
  `title` varchar(200) DEFAULT NULL,
  `body` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;