using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class RefactorNewsStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "news_announcement_translations");

            migrationBuilder.DropTable(
                name: "news_announcements");

            migrationBuilder.CreateTable(
                name: "news",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    uuid = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    category_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    cover_image_file_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    published_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    views = table.Column<uint>(type: "int unsigned", nullable: false),
                    is_featured = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    author_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    read_time = table.Column<int>(type: "int", nullable: true),
                    video_url = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    slug = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    summary = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    content = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_keywords = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    updated_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    published_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_news", x => x.id);
                    table.ForeignKey(
                        name: "fk_news_files_cover_image_file_id",
                        column: x => x.cover_image_file_id,
                        principalTable: "files",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_news_news_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "news_categories",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "news_translations",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    news_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    language_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    slug = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    summary = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    content = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_keywords = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    canonical_url = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    og_image_file_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    search_keywords = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_news_translations", x => x.id);
                    table.ForeignKey(
                        name: "fk_news_translations_files_og_image_file_id",
                        column: x => x.og_image_file_id,
                        principalTable: "files",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_news_translations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_news_translations_news_news_id",
                        column: x => x.news_id,
                        principalTable: "news",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_news_category_id",
                table: "news",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_cover_image_file_id",
                table: "news",
                column: "cover_image_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_slug",
                table: "news",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_news_translations_language_id",
                table: "news_translations",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_translations_news_id_language_id",
                table: "news_translations",
                columns: new[] { "news_id", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_news_translations_og_image_file_id",
                table: "news_translations",
                column: "og_image_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_translations_slug_language_id",
                table: "news_translations",
                columns: new[] { "slug", "language_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "news_translations");

            migrationBuilder.DropTable(
                name: "news");

            migrationBuilder.CreateTable(
                name: "news_announcements",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    category_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    cover_image_file_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    author_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    is_featured = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    published_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    published_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    read_time = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    updated_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    uuid = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    video_url = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    views = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_news_announcements", x => x.id);
                    table.ForeignKey(
                        name: "fk_news_announcements_files_cover_image_file_id",
                        column: x => x.cover_image_file_id,
                        principalTable: "files",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_news_announcements_news_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "news_categories",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "news_announcement_translations",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    language_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    news_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    og_image_file_id = table.Column<uint>(type: "int unsigned", nullable: true),
                    canonical_url = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    content = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_keywords = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    meta_title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    search_keywords = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    slug = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    summary = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_news_announcement_translations", x => x.id);
                    table.ForeignKey(
                        name: "fk_news_announcement_translations_files_og_image_file_id",
                        column: x => x.og_image_file_id,
                        principalTable: "files",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_news_announcement_translations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_news_announcement_translations_news_announcements_news_id",
                        column: x => x.news_id,
                        principalTable: "news_announcements",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_news_announcement_translations_language_id",
                table: "news_announcement_translations",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_announcement_translations_news_id_language_id",
                table: "news_announcement_translations",
                columns: new[] { "news_id", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_news_announcement_translations_og_image_file_id",
                table: "news_announcement_translations",
                column: "og_image_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_announcement_translations_slug_language_id",
                table: "news_announcement_translations",
                columns: new[] { "slug", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_news_announcements_category_id",
                table: "news_announcements",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_news_announcements_cover_image_file_id",
                table: "news_announcements",
                column: "cover_image_file_id");
        }
    }
}
