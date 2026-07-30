using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNewsTable_AddProfessionalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "author_name",
                table: "news_announcements",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "is_featured",
                table: "news_announcements",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "read_time",
                table: "news_announcements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "video_url",
                table: "news_announcements",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "author_name",
                table: "news_announcements");

            migrationBuilder.DropColumn(
                name: "is_featured",
                table: "news_announcements");

            migrationBuilder.DropColumn(
                name: "read_time",
                table: "news_announcements");

            migrationBuilder.DropColumn(
                name: "video_url",
                table: "news_announcements");
        }
    }
}
