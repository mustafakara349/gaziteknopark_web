using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementsSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "announcement_categories",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    slug = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    order_no = table.Column<uint>(type: "int unsigned", nullable: false),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    updated_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_announcement_categories", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "announcement_category_translations",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    announcement_category_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    language_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_announcement_category_translations", x => x.id);
                    table.ForeignKey(
                        name: "fk_announcement_category_translations_announcement_categories_a",
                        column: x => x.announcement_category_id,
                        principalTable: "announcement_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_announcement_category_translations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "announcements",
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
                    is_pinned = table.Column<bool>(type: "tinyint(1)", nullable: false),
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
                    action_url = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    action_label = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    updated_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    published_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_announcements", x => x.id);
                    table.ForeignKey(
                        name: "fk_announcements_announcement_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "announcement_categories",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_announcements_files_cover_image_file_id",
                        column: x => x.cover_image_file_id,
                        principalTable: "files",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "announcement_attachments",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    announcement_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    file_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    order_no = table.Column<uint>(type: "int unsigned", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_announcement_attachments", x => x.id);
                    table.ForeignKey(
                        name: "fk_announcement_attachments_announcements_announcement_id",
                        column: x => x.announcement_id,
                        principalTable: "announcements",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_announcement_attachments_files_file_id",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "announcement_translations",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    announcement_id = table.Column<uint>(type: "int unsigned", nullable: false),
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
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    action_label = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_announcement_translations", x => x.id);
                    table.ForeignKey(
                        name: "fk_announcement_translations_announcements_announcement_id",
                        column: x => x.announcement_id,
                        principalTable: "announcements",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_announcement_translations_files_og_image_file_id",
                        column: x => x.og_image_file_id,
                        principalTable: "files",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_announcement_translations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_announcement_attachments_announcement_id_file_id",
                table: "announcement_attachments",
                columns: new[] { "announcement_id", "file_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_announcement_attachments_file_id",
                table: "announcement_attachments",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "ix_announcement_category_translations_announcement_category_id_",
                table: "announcement_category_translations",
                columns: new[] { "announcement_category_id", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_announcement_category_translations_language_id",
                table: "announcement_category_translations",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "ix_announcement_translations_announcement_id_language_id",
                table: "announcement_translations",
                columns: new[] { "announcement_id", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_announcement_translations_language_id",
                table: "announcement_translations",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "ix_announcement_translations_og_image_file_id",
                table: "announcement_translations",
                column: "og_image_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_announcement_translations_slug_language_id",
                table: "announcement_translations",
                columns: new[] { "slug", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_announcements_category_id",
                table: "announcements",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_announcements_cover_image_file_id",
                table: "announcements",
                column: "cover_image_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_announcements_slug",
                table: "announcements",
                column: "slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "announcement_attachments");

            migrationBuilder.DropTable(
                name: "announcement_category_translations");

            migrationBuilder.DropTable(
                name: "announcement_translations");

            migrationBuilder.DropTable(
                name: "announcements");

            migrationBuilder.DropTable(
                name: "announcement_categories");
        }
    }
}
