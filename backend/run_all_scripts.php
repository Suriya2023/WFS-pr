<?php
// d:\xampp\htdocs\BGL-EXP\backend\run_all_scripts.php
require_once 'config.php';

echo "<pre>";
echo "Step 1: Restarting Database (DROP and CREATE)\n";
try {
    $pdo->exec("DROP DATABASE IF EXISTS user_dash_db;");
    $pdo->exec("CREATE DATABASE user_dash_db;");
    $pdo->exec("USE user_dash_db;");
    echo "Database created successfully.\n\n";
} catch (PDOException $e) {
    echo "Error recreating DB: " . $e->getMessage() . "\n";
    die();
}

echo "Step 2: Importing master_schema.sql\n";
$sqlFile = __DIR__ . '/database/master_schema.sql';
if (file_exists($sqlFile)) {
    $sql = file_get_contents($sqlFile);
    try {
        $pdo->exec($sql);
        echo "master_schema.sql imported successfully.\n\n";
    } catch (PDOException $e) {
        echo "Error importing master_schema.sql: " . $e->getMessage() . "\n";
    }

    echo "Ensuring notifications table exists...\n";
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `notifications` (
            `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `user_id` int(11) DEFAULT NULL,
            `title` varchar(100) DEFAULT NULL,
            `message` text DEFAULT NULL,
            `type` varchar(50) DEFAULT NULL,
            `isRead` tinyint(1) DEFAULT '0',
            `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
            CONSTRAINT `fk_nots_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB;");
        echo "Notifications table created.\n\n";
    } catch (PDOException $e) {
        echo "Error creating notifications table: " . $e->getMessage() . "\n";
    }
} else {
    echo "master_schema.sql not found!\n\n";
}

echo "Step 3: Running Migration Scripts\n";
$migrations = [
    'migrate_v2.php',
    'migrate_v3.php',
    'migrate_v4.php',
    'migrate_v6.php',
    'migrate_v7.php'
];

foreach ($migrations as $script) {
    if (file_exists(__DIR__ . '/' . $script)) {
        echo "Running $script...\n";
        // We capture output
        ob_start();
        include __DIR__ . '/' . $script;
        $output = ob_get_clean();
        echo "Result of $script:\n" . trim($output) . "\n\n";
    } else {
        echo "Script $script not found.\n\n";
    }
}

echo "Database schema setup complete!\n";
echo "</pre>";
?>