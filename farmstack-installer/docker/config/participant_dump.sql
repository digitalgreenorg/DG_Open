-- MySQL dump 10.13  Distrib 8.0.23, for osx10.14 (x86_64)
--
-- Host: localhost    Database: usermanagement
-- ------------------------------------------------------
-- Server version	8.0.23
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `usermanagement`
--

/*!40000 DROP DATABASE IF EXISTS `usermanagement`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `usermanagement` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `usermanagement`;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document` (
  `id` int NOT NULL AUTO_INCREMENT,
  `document` longtext,
  `type` enum('profile','logo','governing_laws','warranties','limitatons_of_liabilities','content') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=521 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitation`
--

DROP TABLE IF EXISTS `invitation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  `token` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isTeamInivitation` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_invitation_email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `invitation_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitation`
--

LOCK TABLES `invitation` WRITE;
/*!40000 ALTER TABLE `invitation` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `org_doc`
--

DROP TABLE IF EXISTS `org_doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `org_doc` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `organisation_id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `document_id` int NOT NULL,
  PRIMARY KEY (`organisation_id`,`document_id`),
  KEY `document_id` (`document_id`),
  CONSTRAINT `org_doc_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `organisation` (`organisation_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `org_doc_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `org_doc`
--

LOCK TABLES `org_doc` WRITE;
/*!40000 ALTER TABLE `org_doc` DISABLE KEYS */;
/*!40000 ALTER TABLE `org_doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisation`
--

DROP TABLE IF EXISTS `organisation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisation` (
  `organisation_id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `organisation_logo` blob,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `organisation_name` varchar(255) DEFAULT NULL,
  `organisation_url` varchar(255) DEFAULT NULL,
  `brand_colors` json DEFAULT NULL,
  `created_by` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`organisation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisation`
--

LOCK TABLES `organisation` WRITE;
/*!40000 ALTER TABLE `organisation` DISABLE KEYS */;
/*!40000 ALTER TABLE `organisation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisation_team`
--

DROP TABLE IF EXISTS `organisation_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisation_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organisation_id` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `user_id` int DEFAULT NULL,
  `user_profile` int DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role_id` int NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `invitation_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_org_team_email` (`email`),
  KEY `organisation_id` (`organisation_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `organisation_team_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `organisation` (`organisation_id`) ON UPDATE CASCADE,
  CONSTRAINT `organisation_team_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisation_team`
--

LOCK TABLES `organisation_team` WRITE;
/*!40000 ALTER TABLE `organisation_team` DISABLE KEYS */;
/*!40000 ALTER TABLE `organisation_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` int NOT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `type` enum('SIGNUP','RECOVER','CHANGE_PWD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expiredAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=564 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module` enum('CENTRAL','PARTICIPANT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'CENTRAL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` (`id`, `name`, `createdAt`, `updatedAt`, `url`, `module`) VALUES (21,'Dashboard','2021-08-12 08:57:54','2021-08-12 08:57:54','/dashboard','PARTICIPANT'),(22,'DataSets','2021-08-12 08:57:54','2021-08-12 08:57:54','/dashboard','PARTICIPANT'),(24,'Settings','2021-08-12 08:57:55','2021-08-12 08:57:55','/settings','PARTICIPANT');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `initial_redirect_url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module` enum('CENTRAL','PARTICIPANT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'CENTRAL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` (`id`, `name`, `createdAt`, `updatedAt`, `initial_redirect_url`, `module`) VALUES (5,'ROOT_ADMIN','2021-06-30 02:07:17','2021-06-30 02:07:17','/dashboard','PARTICIPANT'),(6,'TEAM_ADMIN','2021-06-30 02:07:17','2021-06-30 02:07:17','/dashboard','PARTICIPANT'),(7,'GENERAL','2021-06-30 02:07:17','2021-06-30 02:07:17','/dashboard','PARTICIPANT');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_page`
--

DROP TABLE IF EXISTS `role_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_page` (
  `role_id` int NOT NULL,
  `page_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`role_id`,`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_page`
--

LOCK TABLES `role_page` WRITE;
/*!40000 ALTER TABLE `role_page` DISABLE KEYS */;
INSERT INTO `role_page` (`role_id`, `page_id`, `createdAt`, `updatedAt`) VALUES (5,'21','2021-08-12 09:18:23','2021-08-12 09:18:23'),(5,'22','2021-08-12 09:18:23','2021-08-12 09:18:23'),(5,'23','2021-08-12 09:18:23','2021-08-12 09:18:23'),(5,'24','2021-08-12 09:18:23','2021-08-12 09:18:23');
/*!40000 ALTER TABLE `role_page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `role_id` int NOT NULL,
  `sub_page_id` int NOT NULL,
  `access` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `condition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `actions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`role_id`,`sub_page_id`),
  UNIQUE KEY `role_permission_sub_page_id_role_id_unique` (`role_id`,`sub_page_id`),
  KEY `sub_page_id` (`sub_page_id`),
  CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`sub_page_id`) REFERENCES `subpage` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
INSERT INTO `role_permission` (`role_id`, `sub_page_id`, `access`, `condition`, `createdAt`, `updatedAt`, `actions`) VALUES (5,28,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_PROJECT\": true,\"UPDATE_PROJECT\": true,\"DELETE_PROJECT\":true}'),(5,29,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_CONNECTOR\": true, \"UPDATE_CONNECTOR\": true,\"DELETE_CONNECTOR\": true,\"PLAY_CONNECTOR\": true,\"PAUSE_CONNECTOR\": true}'),(5,30,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_DATASET\": true, \"UPDATE_DATASET\": true,\"DELETE_DATASET\": true}'),(5,31,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_REPO\": true, \"UPDATE_REPO\": true,\"DELETE_REPO\": true,\"PLAY_REPO\": true,,\"PAUSE_REPO\": true}'),(5,32,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_REPO\": true, \"UPDATE_REPO\": true,\"DELETE_REPO\": true,\"PLAY_REPO\": true,,\"PAUSE_REPO\": true}'),(5,33,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_TEAM\": true, \"UPDATE_TEAM\": true,\"DELETE_TEAM\": true}'),(6,28,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_PROJECT\": true,\"UPDATE_PROJECT\": true,\"DELETE_PROJECT\":true}'),(6,29,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_CONNECTOR\": true, \"UPDATE_CONNECTOR\": true,\"DELETE_CONNECTOR\": true,\"PLAY_CONNECTOR\": true,\"PAUSE_CONNECTOR\": true}'),(6,30,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_DATASET\": true, \"UPDATE_DATASET\": true,\"DELETE_DATASET\": true}'),(6,31,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_REPO\": true, \"UPDATE_REPO\": true,\"DELETE_REPO\": true,\"PLAY_REPO\": true,,\"PAUSE_REPO\": true}'),(6,32,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_REPO\": true, \"UPDATE_REPO\": true,\"DELETE_REPO\": true,\"PLAY_REPO\": true,,\"PAUSE_REPO\": true}'),(6,33,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_TEAM\": true, \"UPDATE_TEAM\": true,\"DELETE_TEAM\": true}'),(7,28,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_PROJECT\": true,\"UPDATE_PROJECT\": true,\"DELETE_PROJECT\":true}'),(7,29,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_CONNECTOR\": true, \"UPDATE_CONNECTOR\": true,\"DELETE_CONNECTOR\": true,\"PLAY_CONNECTOR\": true,\"PAUSE_CONNECTOR\": true}'),(7,30,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_DATASET\": true, \"UPDATE_DATASET\": true,\"DELETE_DATASET\": true}'),(7,31,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_REPO\": true, \"UPDATE_REPO\": true,\"DELETE_REPO\": true,\"PLAY_REPO\": true,,\"PAUSE_REPO\": true}'),(7,32,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_REPO\": true, \"UPDATE_REPO\": true,\"DELETE_REPO\": true,\"PLAY_REPO\": true,,\"PAUSE_REPO\": true}'),(7,33,'ALL','','2021-08-12 09:05:25','2021-08-12 09:05:25','{\"ADD_TEAM\": true, \"UPDATE_TEAM\": true,\"DELETE_TEAM\": true}');
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subpage`
--

DROP TABLE IF EXISTS `subpage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subpage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `page_id` (`page_id`),
  CONSTRAINT `subpage_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subpage`
--

LOCK TABLES `subpage` WRITE;
/*!40000 ALTER TABLE `subpage` DISABLE KEYS */;
INSERT INTO `subpage` (`id`, `page_id`, `name`, `url`, `createdAt`, `updatedAt`) VALUES (20,18,'NETWORK_ACTIVITY','','2021-06-30 11:21:59','2021-06-30 11:22:02'),(21,18,'CERTIFICATE','','2021-06-30 11:23:45','2021-06-30 11:23:48'),(22,18,'PARTICIPANT','','2021-06-30 11:25:06','2021-06-30 11:25:09'),(23,19,'ORGANIZATION','','2021-06-30 11:26:19','2021-06-30 11:26:26'),(24,19,'USER','','2021-06-30 11:26:54','2021-06-30 11:26:57'),(25,19,'TEAM','','2021-06-30 11:27:26','2021-06-30 11:27:30'),(26,20,'SEND_INVITATION','','2021-06-30 11:28:34','2021-06-30 11:28:37'),(27,20,'VIEW_INVITATION','','2021-06-30 11:29:08','2021-06-30 11:29:12'),(28,21,'PROJECTS','','2021-08-12 08:58:06','2021-08-12 08:58:06'),(29,21,'CONNECTORS','','2021-08-12 08:58:06','2021-08-12 08:58:06'),(30,22,'DATASETS','','2021-08-12 08:58:06','2021-08-12 08:58:06'),(31,23,'REPOSITORY','','2021-08-12 08:58:06','2021-08-12 08:58:06'),(32,24,'GENERAL','','2021-08-12 08:58:07','2021-08-12 08:58:07'),(33,24,'TEAM','','2021-08-12 08:58:07','2021-08-12 08:58:07');
/*!40000 ALTER TABLE `subpage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` bigint DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isGoogleSignup` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `document_id` int DEFAULT NULL,
  `isDelete` tinyint(1) DEFAULT '0',
  `IsVerified` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `first_name`, `last_name`, `username`, `phone_number`, `email`, `password`, `isGoogleSignup`, `createdAt`, `updatedAt`, `document_id`, `isDelete`) VALUES (44,'Super','Admin','superadmin',9177282954,'superadmin@gmail.com','$2a$08$/mjtM3hpc9WQR2HsjfrpKO24id7YWTwbrax0JqJ3hIYTWv0pKkpXa',0,'2021-07-05 05:24:46','2021-07-05 05:24:46',NULL,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-09-15 14:07:05