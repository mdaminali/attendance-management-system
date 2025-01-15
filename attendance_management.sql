/*
SQLyog Community v11.52 (64 bit)
MySQL - 5.5.8 : Database - attendance_management
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`attendance_management` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `attendance_management`;

/*Table structure for table `admins` */

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `admins` */

insert  into `admins`(`id`,`email`,`password`) values (1,'admin@gmail.com','Admin@123');

/*Table structure for table `attendance` */

DROP TABLE IF EXISTS `attendance`;

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_email` varchar(50) NOT NULL,
  `course_code` varchar(10) NOT NULL,
  `present_status` varchar(2) NOT NULL DEFAULT 'A',
  `datetime` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `attendance` */

insert  into `attendance`(`id`,`student_email`,`course_code`,`present_status`,`datetime`) values (1,'amin1@gmail.com','12345678','P','07-01-2025'),(2,'amin2@gmail.com','12345678','P','07-01-2025'),(3,'amin1@gmail.com','12345678','A','08-07-2025'),(4,'amin2@gmail.com','12345678','A','08-07-2025'),(5,'amin1@gmail.com','12345678','P','09-01-2025'),(6,'amin1@gmail.com','12345678','P','15-01-2024');

/*Table structure for table `courses` */

DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

/*Data for the table `courses` */

insert  into `courses`(`id`,`email`,`code`,`title`) values (3,'user1@example.com','123','test'),(4,'user1@example.com','455455','fdsfsfsff'),(5,'teacher1@gmail.com','12345678','Database & Storage Security'),(8,'teacher1@gmail.com','5454','dsfsf');

/*Table structure for table `schedule` */

DROP TABLE IF EXISTS `schedule`;

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `classDetails` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `schedule` */

insert  into `schedule`(`id`,`code`,`classDetails`) values (3,'5454','[{\"datetime\":\"2025-01-07T06:29:53.828Z\",\"class_type\":\"Online\"}]'),(8,'12345678','[{\"datetime\":\"2025-01-07T06:29:51.782Z\",\"class_type\":\"Online\"},{\"datetime\":\"2025-01-08T06:29:53.828Z\",\"class_type\":\"Online\"},{\"datetime\":\"2025-01-14T10:00:00.000Z\",\"class_type\":\"Offline\"},{\"datetime\":\"2025-01-15T11:00:00.000Z\",\"class_type\":\"Offline\"},{\"datetime\":\"2025-01-20T07:04:52.707Z\",\"class_type\":\"Online\"}]');

/*Table structure for table `students` */

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `userRoll` varchar(10) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(50) NOT NULL,
  `androidId` varchar(50) NOT NULL,
  `courses` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

/*Data for the table `students` */

insert  into `students`(`id`,`name`,`userRoll`,`email`,`password`,`androidId`,`courses`) values (1,'John Doe','','18','12th','1588b459af21329b',NULL),(2,'Jane Doe','222','amin2@gmail.com','Test@2','1588b459af21329b',NULL),(7,'Amin','111','amin1@gmail.com','Test@1','1588b459af21329b','12345678, 5454');

/*Table structure for table `teachers` */

DROP TABLE IF EXISTS `teachers`;

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

/*Data for the table `teachers` */

insert  into `teachers`(`id`,`email`,`password`) values (12,'teacher1@gmail.com','teacher1');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
