-- 1. 카테고리 그룹 테이블
CREATE TABLE tbl_category_group (
    category_group_id INT PRIMARY KEY AUTO_INCREMENT,
    category_group_name VARCHAR(255) NOT NULL UNIQUE,
    next_category_group_id INT NULL,
    FOREIGN KEY (next_category_group_id) REFERENCES tbl_category_group(category_group_id)
);

-- 2. 카테고리 테이블
CREATE TABLE tbl_category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    category_desc VARCHAR(255) NULL,
    category_group_id INT NOT NULL,
    FOREIGN KEY (category_group_id) REFERENCES tbl_category_group(category_group_id),
    INDEX idx_category_name(category_name)
);

-- 3. 태그 테이블
CREATE TABLE tbl_tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255) NOT NULL UNIQUE
);

-- 4. 게시글 테이블
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

-- 5. 게시글-태그 관계 테이블 (다대다 관계)
CREATE TABLE tbl_post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id),
    FOREIGN KEY (tag_id) REFERENCES tbl_tag(tag_id)
);

-- 6. 게시글에 포함된 이미지 테이블
CREATE TABLE tbl_post_embed_image (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    image_file_name VARCHAR(255) NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);

-- 7. 게시글에 첨부된 파일 테이블
CREATE TABLE tbl_post_uploaded_file (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);

-- 8. 사용자 계정 테이블
CREATE TABLE tbl_account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    encoded_pw VARCHAR(255) NOT NULL,
    INDEX idx_user_email(user_email)
);