-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 05:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `username` varchar(20) NOT NULL,
  `courseId` varchar(20) NOT NULL,
  `title` varchar(20) NOT NULL,
  `instructor` varchar(20) NOT NULL,
  `term` varchar(20) NOT NULL,
  `enable` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`username`, `courseId`, `title`, `instructor`, `term`, `enable`) VALUES
('adams', 'SOEN 287', 'Web Programming', 'Prof. Prof', 'Fall 2025', 1),
('adams', 'COMP 248', 'Web Programming', 'Prof. Green', 'Winter 2026', 1),
('professor1', 'SOEN 311', 'Probability and Stat', 'Staff', 'Fall 2026', 1);

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `CourseId` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `dueDate` date NOT NULL,
  `weight` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`CourseId`, `name`, `dueDate`, `weight`) VALUES
('', '', '0000-00-00', 0),
('SOEN 287', 'lab 4', '2026-04-17', 20),
('SOEN 287', 'Final', '2026-04-09', 100),
('SOEN 311', 'lab', '2026-04-22', 50);

-- --------------------------------------------------------

--
-- Table structure for table `companion`
--

CREATE TABLE `companion` (
  `username` varchar(20) NOT NULL,
  `course` varchar(10) NOT NULL,
  `assignment` varchar(20) NOT NULL,
  `dueDate` date NOT NULL,
  `grade` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companion`
--

INSERT INTO `companion` (`username`, `course`, `assignment`, `dueDate`, `grade`, `status`) VALUES
('adams', 'SOEN 287', 'empty', '0000-00-00', 0, 1),
('adams', 'SOEN 287', 'lab 4', '2026-04-17', 18, 1),
('adams', 'SOEN 287', 'midterm', '2026-04-30', 28, 1),
('adams', 'SOEN 311', 'empty', '0000-00-00', 0, 1),
('adams', 'SOEN 287', 'Final', '2026-04-09', 85, 1),
('adams', 'SOEN 311', 'lab', '2026-04-22', 45, 1);

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `username`, `name`, `password`) VALUES
(1, 'adam', 'adam', '123456789'),
(2, 'adams', 'ada', '123456789'),
(3, 'adams', 'ada', '123456789'),
(5, 'professor1', 'test1', '123456789');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `username`, `name`, `password`) VALUES
(3, 'adams', 'adam', '213124132'),
(4, 'adams', 'adam', 'newpassword'),
(6, 'adams', 'adam', '123456789'),
(18, 'adsasd', 'sadasd', '31124324432');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
