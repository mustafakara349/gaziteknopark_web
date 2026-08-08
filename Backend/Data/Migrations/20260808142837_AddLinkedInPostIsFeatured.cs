using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkedInPostIsFeatured : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_featured",
                table: "linkedin_posts",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_featured",
                table: "linkedin_posts");
        }
    }
}
