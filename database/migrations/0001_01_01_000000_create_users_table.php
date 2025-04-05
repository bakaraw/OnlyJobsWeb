<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('middle_name', 255)->nullable();
            $table->string('suffix', 255)->nullable();
            $table->string('email')->unique();
            $table->string('contact_number', 20);
            $table->date('birthdate');
            $table->enum('gender', ['male', 'female', 'others']);
            // address
            $table->foreignId('address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
           // $table->enum('account_type', ['jobseeker', 'company']);
            $table->rememberToken();
            $table->timestamps();
            $table->unsignedBigInteger('account_id')->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['address_id']); // Drop foreign key constraint first
            $table->dropColumn('address_id');    // Then drop the column
        });

        Schema::dropIfExists('job_seeker'); // Drop job_seeker first
        Schema::dropIfExists('companies');  // Drop company second
        Schema::dropIfExists('users');      // Drop users table last
    }
};
