-- 1. CATEGORY GROUP TABLE
CREATE TABLE tbl_category_group (
    category_group_id INT PRIMARY KEY AUTO_INCREMENT,
    category_group_name VARCHAR(255) NOT NULL UNIQUE,
    next_category_group_id INT NULL,
    FOREIGN KEY (next_category_group_id) REFERENCES tbl_category_group(category_group_id)
);

-- 2. CATEGORY TABLE
CREATE TABLE tbl_category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    category_desc VARCHAR(255) NULL,
    category_group_id INT NOT NULL,
    FOREIGN KEY (category_group_id) REFERENCES tbl_category_group(category_group_id),
    INDEX idx_category_name(category_name)
);

-- 3. TAG TABLE
CREATE TABLE tbl_tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255) NOT NULL UNIQUE
);

-- 4. POST TABLE
CREATE TABLE tbl_post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_status ENUM('draft', 'published', 'hidden') NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    category_id INT NOT NULL,
    cover_image_id INT NULL,
    FOREIGN KEY (category_id) REFERENCES tbl_category(category_id),
    FOREIGN KEY (cover_image_id) REFERENCES tbl_post_embed_image(image_id),
    FULLTEXT INDEX idx_post_title_content(post_title, post_content)
);

-- 5. POST-TAG RELATION TABLE (MANY-TO-MANY)
CREATE TABLE tbl_post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id),
    FOREIGN KEY (tag_id) REFERENCES tbl_tag(tag_id)
);

-- 6. POST-EMBED IMAGE TABLE
CREATE TABLE tbl_post_embed_image (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    image_file_name VARCHAR(255) NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);

-- 7. POST-UPLOADED FILE TABLE
CREATE TABLE tbl_post_uploaded_file (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);

-- 8. ACCOUNT TABLE
CREATE TABLE tbl_account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    encoded_pw VARCHAR(255) NOT NULL,
    INDEX idx_user_email(user_email)
);