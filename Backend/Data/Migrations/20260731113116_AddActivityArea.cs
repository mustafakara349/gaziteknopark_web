using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddActivityArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "activity_areas",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    created_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    updated_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_by = table.Column<uint>(type: "int unsigned", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_activity_areas", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "activity_area_translations",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    activity_area_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    language_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_activity_area_translations", x => x.id);
                    table.ForeignKey(
                        name: "fk_activity_area_translations_activity_areas_activity_area_id",
                        column: x => x.activity_area_id,
                        principalTable: "activity_areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_activity_area_translations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "company_activity_area_pivot",
                columns: table => new
                {
                    company_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    activity_area_id = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_company_activity_area_pivot", x => new { x.company_id, x.activity_area_id });
                    table.ForeignKey(
                        name: "fk_company_activity_area_pivot_activity_areas_activity_area_id",
                        column: x => x.activity_area_id,
                        principalTable: "activity_areas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_company_activity_area_pivot_companies_company_id",
                        column: x => x.company_id,
                        principalTable: "companies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_activity_area_translations_activity_area_id_language_id",
                table: "activity_area_translations",
                columns: new[] { "activity_area_id", "language_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_activity_area_translations_language_id",
                table: "activity_area_translations",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "ix_company_activity_area_pivot_activity_area_id",
                table: "company_activity_area_pivot",
                column: "activity_area_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activity_area_translations");

            migrationBuilder.DropTable(
                name: "company_activity_area_pivot");

            migrationBuilder.DropTable(
                name: "activity_areas");
        }
    }
}
