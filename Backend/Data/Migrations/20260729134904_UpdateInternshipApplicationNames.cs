using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInternshipApplicationNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "full_name",
                table: "internship_applications");

            migrationBuilder.AddColumn<string>(
                name: "first_name",
                table: "internship_applications",
                type: "varchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "last_name",
                table: "internship_applications",
                type: "varchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "first_name",
                table: "internship_applications");

            migrationBuilder.DropColumn(
                name: "last_name",
                table: "internship_applications");

            migrationBuilder.AddColumn<string>(
                name: "full_name",
                table: "internship_applications",
                type: "varchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
