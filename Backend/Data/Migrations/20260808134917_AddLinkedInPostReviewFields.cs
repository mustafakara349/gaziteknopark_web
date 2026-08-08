using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaziTeknoparkApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkedInPostReviewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "approved_at",
                table: "linkedin_posts",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<uint>(
                name: "approved_by",
                table: "linkedin_posts",
                type: "int unsigned",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "show_on_homepage",
                table: "linkedin_posts",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "show_on_stories",
                table: "linkedin_posts",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "linkedin_posts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "linkedin_posts",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "ix_linkedin_posts_approved_by",
                table: "linkedin_posts",
                column: "approved_by");

            migrationBuilder.CreateIndex(
                name: "ix_linkedin_posts_linkedin_post_urn",
                table: "linkedin_posts",
                column: "linkedin_post_urn",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_linkedin_posts_users_approved_by",
                table: "linkedin_posts",
                column: "approved_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.Sql("UPDATE linkedin_posts SET status = 1, show_on_homepage = 1, show_on_stories = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_linkedin_posts_users_approved_by",
                table: "linkedin_posts");

            migrationBuilder.DropIndex(
                name: "ix_linkedin_posts_approved_by",
                table: "linkedin_posts");

            migrationBuilder.DropIndex(
                name: "ix_linkedin_posts_linkedin_post_urn",
                table: "linkedin_posts");

            migrationBuilder.DropColumn(
                name: "approved_at",
                table: "linkedin_posts");

            migrationBuilder.DropColumn(
                name: "approved_by",
                table: "linkedin_posts");

            migrationBuilder.DropColumn(
                name: "show_on_homepage",
                table: "linkedin_posts");

            migrationBuilder.DropColumn(
                name: "show_on_stories",
                table: "linkedin_posts");

            migrationBuilder.DropColumn(
                name: "status",
                table: "linkedin_posts");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "linkedin_posts");
        }
    }
}
