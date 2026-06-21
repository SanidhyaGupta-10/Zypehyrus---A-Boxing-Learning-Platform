/**
 * Leaderboard Manager
 * Handles syncing scores to Supabase leaderboards
 */

const LeaderboardManager = {
    RING_NAME_KEY: 'boxing_ring_name',

    getRingName() {
        return localStorage.getItem(this.RING_NAME_KEY) || 'Anonymous Fighter';
    },

    setRingName(name) {
        localStorage.setItem(this.RING_NAME_KEY, name);
    },

    /**
     * Update reflex score on leaderboard
     * @param {number} avgReflexMs - Average reflex time in milliseconds (lower is better)
     * @param {object} supabase - Supabase client instance
     */
    async updateReflexScore(avgReflexMs, supabase) {
        if (!supabase) {
            console.warn('Supabase client not available for reflex score upload');
            return false;
        }

        try {
            const displayVal = `${Math.round(avgReflexMs)}ms`;
            const ringName = this.getRingName();
            
            const { data, error } = await supabase
                .from('leaderboard_reflex')
                .upsert(
                    {
                        name: ringName,
                        score: avgReflexMs,
                        display_val: displayVal,
                        last_updated: new Date().toISOString()
                    },
                    { onConflict: 'name' }
                );

            if (error) {
                console.error('Error updating reflex leaderboard:', error);
                return false;
            }

            console.log('??? Reflex score synced:', ringName, displayVal);
            return true;
        } catch (err) {
            console.error('Reflex score sync failed:', err);
            return false;
        }
    },

    /**
     * Update combo score on leaderboard
     * @param {number} avgComboScore - Average combo points per level
     * @param {object} supabase - Supabase client instance
     */
    async updateComboScore(avgComboScore, supabase) {
        if (!supabase) {
            console.warn('Supabase client not available for combo score upload');
            return false;
        }

        try {
            const displayVal = `${Math.round(avgComboScore)} pts`;
            const ringName = this.getRingName();
            
            const { data, error } = await supabase
                .from('leaderboard_combo')
                .upsert(
                    {
                        name: ringName,
                        score: avgComboScore,
                        display_val: displayVal,
                        last_updated: new Date().toISOString()
                    },
                    { onConflict: 'name' }
                );

            if (error) {
                console.error('Error updating combo leaderboard:', error);
                return false;
            }

            console.log('??? Combo score synced:', ringName, displayVal);
            return true;
        } catch (err) {
            console.error('Combo score sync failed:', err);
            return false;
        }
    },

    /**
     * Update streak days on leaderboard
     * @param {number} streakDays - Number of consecutive days trained
     * @param {object} supabase - Supabase client instance
     */
    async updateStreakScore(streakDays, supabase) {
        if (!supabase) {
            console.warn('Supabase client not available for streak score upload');
            return false;
        }

        try {
            const displayVal = `${streakDays} days`;
            const ringName = this.getRingName();
            
            const { data, error } = await supabase
                .from('leaderboard_streaks')
                .upsert(
                    {
                        name: ringName,
                        score: streakDays,
                        display_val: displayVal,
                        last_updated: new Date().toISOString()
                    },
                    { onConflict: 'name' }
                );

            if (error) {
                console.error('Error updating streak leaderboard:', error);
                return false;
            }

            console.log('??? Streak score synced:', ringName, displayVal);
            return true;
        } catch (err) {
            console.error('Streak score sync failed:', err);
            return false;
        }
    },

    /**
     * Fetch top players from leaderboard
     * @param {object} supabase - Supabase client instance
     * @param {string} tableName - Table name (leaderboard_reflex, leaderboard_streaks, leaderboard_combo)
     * @param {boolean} isAscending - Sort ascending (for reflex) or descending (for others)
     * @param {number} limit - Number of top players to fetch
     * @returns {Promise<Array>} Array of leaderboard entries
     */
    async getLeaderboard(supabase, tableName, isAscending = false, limit = 100) {
        if (!supabase) {
            console.warn('Supabase client not available');
            return [];
        }

        try {
            let query = supabase
                .from(tableName)
                .select('*')
                .order('score', { ascending: isAscending })
                .limit(limit);

            const { data, error } = await query;

            if (error) {
                console.error(`Error fetching ${tableName}:`, error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error(`Failed to fetch ${tableName}:`, err);
            return [];
        }
    },

    /**
     * Get current user's rank in a leaderboard
     * @param {object} supabase - Supabase client instance
     * @param {string} tableName - Table name
     * @param {boolean} isAscending - Sort ascending or descending
     * @returns {Promise<Object>} User's rank info
     */
    async getUserRank(supabase, tableName, isAscending = false) {
        if (!supabase) {
            console.warn('Supabase client not available');
            return null;
        }

        try {
            const ringName = this.getRingName();
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('score', { ascending: isAscending });

            if (error || !data) {
                console.error(`Error fetching user rank for ${tableName}:`, error);
                return null;
            }

            // Find user's position
            const userIndex = data.findIndex(entry => entry.name === ringName);
            if (userIndex === -1) return null;

            return {
                rank: userIndex + 1,
                totalPlayers: data.length,
                ...data[userIndex]
            };
        } catch (err) {
            console.error(`Failed to get user rank for ${tableName}:`, err);
            return null;
        }
    }
};

