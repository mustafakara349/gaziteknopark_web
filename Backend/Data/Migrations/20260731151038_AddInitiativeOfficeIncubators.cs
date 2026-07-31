using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInitiativeOfficeIncubators : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "initiative_office_incubators",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    initiative_office_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    icon = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    order_index = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_initiative_office_incubators", x => x.id);
                    table.ForeignKey(
                        name: "fk_initiative_office_incubators_initiative_office_initiative_of",
                        column: x => x.initiative_office_id,
                        principalTable: "initiative_office",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "initiative_office_incubator_translations",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    incubator_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    language_id = table.Column<uint>(type: "int unsigned", nullable: false),
                    title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    subtitle = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    features = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_initiative_office_incubator_translations", x => x.id);
                    table.ForeignKey(
                        name: "fk_initiative_office_incubator_translations_initiative_office_i",
                        column: x => x.incubator_id,
                        principalTable: "initiative_office_incubators",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_initiative_office_incubator_translations_languages_language_",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_initiative_office_incubator_translations_incubator_id",
                table: "initiative_office_incubator_translations",
                column: "incubator_id");

            migrationBuilder.CreateIndex(
                name: "ix_initiative_office_incubator_translations_language_id",
                table: "initiative_office_incubator_translations",
                column: "language_id");

            migrationBuilder.CreateIndex(
                name: "ix_initiative_office_incubators_initiative_office_id",
                table: "initiative_office_incubators",
                column: "initiative_office_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "initiative_office_incubator_translations");

            migrationBuilder.DropTable(
                name: "initiative_office_incubators");
        }
    }
}
