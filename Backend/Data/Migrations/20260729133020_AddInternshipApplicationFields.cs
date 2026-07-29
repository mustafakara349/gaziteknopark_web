using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInternshipApplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "internship_time",
                table: "internship_applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "internship_type",
                table: "internship_applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<uint>(
                name: "photo_file_id",
                table: "internship_applications",
                type: "int unsigned",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "university_start_date",
                table: "internship_applications",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_internship_applications_photo_file_id",
                table: "internship_applications",
                column: "photo_file_id");

            migrationBuilder.AddForeignKey(
                name: "fk_internship_applications_files_photo_file_id",
                table: "internship_applications",
                column: "photo_file_id",
                principalTable: "files",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_internship_applications_files_photo_file_id",
                table: "internship_applications");

            migrationBuilder.DropIndex(
                name: "ix_internship_applications_photo_file_id",
                table: "internship_applications");

            migrationBuilder.DropColumn(
                name: "internship_time",
                table: "internship_applications");

            migrationBuilder.DropColumn(
                name: "internship_type",
                table: "internship_applications");

            migrationBuilder.DropColumn(
                name: "photo_file_id",
                table: "internship_applications");

            migrationBuilder.DropColumn(
                name: "university_start_date",
                table: "internship_applications");
        }
    }
}
