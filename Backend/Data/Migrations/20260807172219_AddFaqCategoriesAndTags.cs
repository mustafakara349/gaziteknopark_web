using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFaqCategoriesAndTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "tags",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "slug",
                table: "tags",
                type: "varchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "answer",
                table: "faq",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "button_link",
                table: "faq",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "button_text",
                table: "faq",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<uint>(
                name: "faq_category_id",
                table: "faq",
                type: "int unsigned",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "question",
                table: "faq",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "faq_categories",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    slug = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    order_no = table.Column<uint>(type: "int unsigned", nullable: false),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    updated_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_faq_categories", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "faq_tag",
                columns: table => new
                {
                    faq_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    tag_id = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_faq_tag", x => new { x.faq_id, x.tag_id });
                    table.ForeignKey(
                        name: "fk_faq_tag_faq_faq_id",
                        column: x => x.faq_id,
                        principalTable: "faq",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_faq_tag_tags_tag_id",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_tags_slug",
                table: "tags",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_faq_faq_category_id",
                table: "faq",
                column: "faq_category_id");

            migrationBuilder.CreateIndex(
                name: "ix_faq_categories_slug",
                table: "faq_categories",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_faq_tag_tag_id",
                table: "faq_tag",
                column: "tag_id");

            migrationBuilder.AddForeignKey(
                name: "fk_faq_faq_categories_faq_category_id",
                table: "faq",
                column: "faq_category_id",
                principalTable: "faq_categories",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_faq_faq_categories_faq_category_id",
                table: "faq");

            migrationBuilder.DropTable(
                name: "faq_categories");

            migrationBuilder.DropTable(
                name: "faq_tag");

            migrationBuilder.DropIndex(
                name: "ix_tags_slug",
                table: "tags");

            migrationBuilder.DropIndex(
                name: "ix_faq_faq_category_id",
                table: "faq");

            migrationBuilder.DropColumn(
                name: "name",
                table: "tags");

            migrationBuilder.DropColumn(
                name: "slug",
                table: "tags");

            migrationBuilder.DropColumn(
                name: "answer",
                table: "faq");

            migrationBuilder.DropColumn(
                name: "button_link",
                table: "faq");

            migrationBuilder.DropColumn(
                name: "button_text",
                table: "faq");

            migrationBuilder.DropColumn(
                name: "faq_category_id",
                table: "faq");

            migrationBuilder.DropColumn(
                name: "question",
                table: "faq");
        }
    }
}
